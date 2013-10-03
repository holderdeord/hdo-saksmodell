require 'sinatra'
require 'sequel'
require 'logger'
require './database'

set :public_folder, File.expand_path("../public", __FILE__)
set :start_time, Time.now
set :log, Logger.new(STDOUT)
set :db, Database.new(logger: settings.log)

get '/' do
  erb :index
end

get '/issues' do
  content_type :json
  settings.db.list.map(:slug).to_json
end

get '/issues/:slug' do |slug|
  content_type :json
  settings.db.get(slug).to_json
end

post '/issues/:slug' do |slug|
  content_type :json

  data = json_body

  if data['slug'] =~ /(.+)-v(\d+)$/
    slug, version = $1, $2.to_i
    data['slug'] = "#{slug}-v#{version + 1}"
  else
    data['slug'] << '-v1'
  end

  settings.db.insert(data)

  {success: true, slug: data['slug']}.to_json
end

put '/issues/:slug' do |slug|
  content_type :json

  data = json_body
  settings.db.update(data)
  settings.log.info "saved: #{data.inspect}"

  {success: true}.to_json
end

get '/reimport' do
  settings.db.clear if params[:clear]
  settings.db.import

  redirect '/'
end

helpers do
  def json_body
    JSON.parse(request.body.read)
  end

  def revision
    `git rev-parse HEAD`[0,7]
  rescue
    'unknown'
  end
end