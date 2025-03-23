json.contests do
  json.array! @contests do |contest|
    json.partial! 'api/v1/contests/details', contest: contest
  end
end