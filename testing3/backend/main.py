from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import pandas as pd
import uuid
from sklearn.cluster import KMeans
import os

# Setup Supabase
SUPABASE_URL = "https://yvtccqdgbtorymyhqjds.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2dGNjcWRnYnRvcnlteWhxamRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4OTkxMzksImV4cCI6MjA2ODQ3NTEzOX0.xL2YYwYhn08D_CwPk9RQ9Jdx4fAkjSz7ZUAS1BTVlpk"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)
    for _, row in df.iterrows():
        supabase.table("orders").insert({
            "order_id": row["order_id"],
            "pincode": row["pincode"],
            "lat": row["lat"],
            "lng": row["lng"],
            "weight": row["weight"]
        }).execute()
    return {"status": "success"}

@app.post("/batches/generate")
def generate_batches(n_clusters: int = 3):
    orders = supabase.table("orders").select("*").is_("batch_id", None).execute().data
    df = pd.DataFrame(orders)
    if df.empty:
        return {"status": "no unbatched orders"}
    coords = df[["lat", "lng"]]
    kmeans = KMeans(n_clusters=n_clusters)
    df["cluster"] = kmeans.fit_predict(coords)
    for cluster_id in df["cluster"].unique():
        cluster_orders = df[df["cluster"] == cluster_id]
        batch_id = str(uuid.uuid4())
        supabase.table("batches").insert({"id": batch_id, "name": f"Batch {cluster_id}"}).execute()
        for _, row in cluster_orders.iterrows():
            supabase.table("orders").update({"batch_id": batch_id}).eq("id", row["id"]).execute()
    return {"status": "batches created"}

# @app.delete("/batches/delete_all")
# def delete_all_batches():
#     supabase.table("orders").update({"batch_id": None}).neq("batch_id", None).execute()
#     supabase.table("batches").delete().neq("id", "").execute()
#     return {"status": "all batches deleted"}
