aws s3 cp "dist.js" "s3://rafraser-assets/antarctica/dist.js"
aws s3 cp "dist.css" "s3://rafraser-assets/antarctica/dist.css"
aws s3 cp "index.html" "s3://rafraser-assets/antarctica/index.html"

# Create an invalidation
# Browser caching is a different problem and one I'll tackle once everything else works well
aws cloudfront create-invalidation --distribution-id "EMDN2V6ZJTW0N" --paths "/antarctica/*"