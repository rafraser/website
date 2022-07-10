aws s3 cp "dist.js" "s3://rafraser-assets/energy-globe/dist.js"
aws s3 cp "dist.css" "s3://rafraser-assets/energy-globe/dist.css"
aws s3 cp "index.html" "s3://rafraser-assets/energy-globe/index.html"

# Create an invalidation
# Browser caching is a different problem and one I'll tackle once everything else works well
aws cloudfront create-invalidation --distribution-id "EMDN2V6ZJTW0N" --paths "/energy-globe/*"