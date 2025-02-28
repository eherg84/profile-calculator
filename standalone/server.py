import http.server
import socketserver
import os

# Change to the parent directory to serve all files
os.chdir('..')

PORT = 8000
DIRECTORY = os.getcwd()

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

print(f"Starting server at http://localhost:{PORT}")
print("View tests at:")
print(f"- http://localhost:{PORT}/.standalone/test/configManager.html")
print(f"- http://localhost:{PORT}/.standalone/test/profileCalculator.html")
print(f"- http://localhost:{PORT}/.standalone/test/materialConfig.html")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"\nServing files from: {DIRECTORY}")
    print("Press Ctrl+C to stop the server")
    httpd.serve_forever() 