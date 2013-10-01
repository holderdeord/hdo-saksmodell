require 'sinatra'
require 'sequel'

set :public_folder, File.expand_path("../public", __FILE__)
set :db, Sequel.connect(ENV['DATABASE_URL'] || ENV['BOXEN_POSTGRESQL_URL'] + 'hdo-saksmodell')

configure do
  # create an items table
  settings.create_table :issues do

  end

end

get '/' do
  erb :index
end

helpers do

end