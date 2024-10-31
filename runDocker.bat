docker run -t -i -p 5000:5000 -v "%cd%:/data" ghcr.io/project-osrm/osrm-backend osrm-routed --algorithm mld /data/poland-latest.osrm
