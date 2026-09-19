import os

# Clean Application Code (SAFE DEMO FILE FOR SECRETGUARD SCANNER)
# Credentials are retrieved safely from environment variables using os.getenv().

API_KEY = os.getenv("API_KEY")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")

def connect_to_service():
    if not API_KEY:
        raise ValueError("API_KEY environment variable is not configured.")
    print("Connecting to service securely using environment variable...")
    return True

if __name__ == "__main__":
    connect_to_service()
