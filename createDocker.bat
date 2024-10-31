docker run -t -v "%cd%:/data" ghcr.io/project-osrm/osrm-backend osrm-extract -p /opt/car.lua /data/poland-latest.osm.pbf || echo "osrm-extract failed"
docker run -t -v "%cd%:/data" ghcr.io/project-osrm/osrm-backend osrm-partition /data/poland-latest.osrm || echo "osrm-partition failed"
docker run -t -v "%cd%:/data" ghcr.io/project-osrm/osrm-backend osrm-customize /data/poland-latest.osrm || echo "osrm-customize failed"
