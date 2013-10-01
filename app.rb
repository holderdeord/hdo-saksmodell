require 'sinatra'
require 'sequel'
require 'logger'
require './database'

set :public_folder, File.expand_path("../public", __FILE__)
set :start_time, Time.now
set :db, Database.new

configure do
end

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

put '/issues/:slug' do |slug|
  content_type :json
  settings.db.save(JSON.parse(request.body)).to_json
end

helpers do
  def issue()

  end

  def revision
    `git rev-parse HEAD`[0,7]
  rescue
    'unknown'
  end
end