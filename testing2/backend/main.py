from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import pandas as pd
from sklearn.cluster import KMeans
import uuid
from datetime import datetime
import numpy as np

SUPABASE_URL = "https://wqfohoxzovkpauasgqlp.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZm9ob3h6b3ZrcGF1YXNncWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4OTE2MTMsImV4cCI6MjA2ODQ2NzYxM30.4_VDwVFn9vqXhngVhWTTiukJPrixj0eBdF6cuzXI7DI"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)
    df["id"] = [str(uuid.uuid4()) for _ in range(len(df))]
    supabase.table("orders").insert(df.to_dict(orient="records")).execute()
    return {"status": "Uploaded"}


@app.post("/generate-batches")
def generate_batches():
    res = supabase.table("orders").select("*").execute()
    orders = res.data
    if not orders:
        return {"error": "No orders to batch"}

    df = pd.DataFrame(orders)
    coords = df[["lat", "lng"]]

    k = max(1, len(df) // 5)  # group approx 5 orders per batch
    kmeans = KMeans(n_clusters=k, n_init="auto")
    df["cluster"] = kmeans.fit_predict(coords)

    for cluster_id, cluster_df in df.groupby("cluster"):
        batch_id = f"BATCH-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:5]}"
        supabase.table("batches").insert({"batch_id": batch_id}).execute()

        for _, row in cluster_df.iterrows():
            supabase.table("batch_orders").insert({
                "batch_id": batch_id,
                "order_id": row["order_id"]
            }).execute()

    return {"status": "Batches Generated", "clusters": k}


@app.get("/batches")
def get_batches():
    result = supabase.table("batch_orders").select("*").execute()
    return result.data
