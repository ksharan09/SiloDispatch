const { supabase } = require('./supabaseClient');
const kmeans = require('ml-kmeans').default;

async function clusterOrdersAndSaveBatches(orders) {
  const dataPoints = orders.map(order => [order.lat, order.lng]);
  const numClusters = Math.ceil(orders.length / 30); // Max 30 orders per batch

  const result = kmeans(dataPoints, numClusters);

  const batchMap = new Map();

  result.clusters.forEach((clusterIndex, i) => {
    const order = orders[i];
    if (!batchMap.has(clusterIndex)) {
      batchMap.set(clusterIndex, []);
    }
    batchMap.get(clusterIndex).push(order);
  });

  const batches = [];

  for (let [clusterIndex, clusterOrders] of batchMap.entries()) {
    let batchWeight = 0;
    const orderIds = [];

    for (const order of clusterOrders) {
      if (batchWeight + order.weight > 25) continue;
      batchWeight += order.weight;
      orderIds.push(order.id);
    }

    const batch_no = `BATCH-${Date.now()}-${clusterIndex}`;
    await supabase.from('batches').insert([
      {
        batch_no,
        order_ids: orderIds,
        total_weight: batchWeight,
      },
    ]);

    await supabase.from('orders')
      .update({ status: 'batched' })
      .in('id', orderIds);

    batches.push({ batch_no, orderIds, batchWeight });
  }

  return batches;
}

module.exports = { clusterOrdersAndSaveBatches };
