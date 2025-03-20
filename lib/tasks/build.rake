namespace :build do
  desc 'Build React app and move it to public directory'
  task :react do
    system 'cd frontend && npm install && npm run build'
    system 'rm -rf public/*'
    system 'cp -a frontend/build/. public/'
  end
end 