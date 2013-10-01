require 'rake'
require 'open3'

task :import do
  id     = Integer(ENV.fetch('ISSUE_ID'))
  dir    = ENV['HDO_SITE_PATH'] || File.expand_path("../../hdo-site", __FILE__)
  stdout = ''

  chdir(dir) do

    script = <<-RUBY
      issue = Issue.find(%d)
      json = issue.as_json(
          include: [
             { :vote_connections    => {:except => [:created_at, :updated_at, :id, :issue_id], :include => {:vote => {:except => [:created_at, :updated_at, :id], methods: :stats}}}},
             { :promise_connections => {:except => [:created_at, :updated_at, :id, :issue_id], :include => {:promise => {:except => [:created_at, :updated_at, :id], :include => {:parties => {:only => [:name, :external_id]}}}}}},
             { :valence_issue_explanations => {:include => {:parties => {:only => [:name, :external_id]}}, :except => [:created_at, :updated_at, :id]}}
          ],
          only: [:slug, :title, :description]
        )

      puts JSON.pretty_generate(json)
    RUBY

    stdout, status = Open3.capture2("bundle", "exec", "rails", "runner", script % id)
  end

  File.open("./data/issues/#{id}.json", "w") { |file| file << stdout }
end

task :recreate do
  sh "dropdb", "hdo-saksmodell"
  sh "createdb", "hdo-saksmodell"
end
