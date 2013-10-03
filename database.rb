class Database
  attr_reader :db

  def initialize(opts = {})
    @log = opts[:logger] || Logger.new(STDOUT)
    @db  = Sequel.connect(ENV['DATABASE_URL'] || ENV['BOXEN_POSTGRESQL_URL'] + 'hdo-saksmodell', :loggers => @log)
    @db.extension :pg_json

    unless @db.table_exists?(:issues)
      @db.run "CREATE TABLE issues (slug VARCHAR(255) NOT NULL, data json NOT NULL)"
    end
  end

  def clear
    list.delete
  end

  def import
    Dir['./data/issues/*.json'].each do |path|
      @log.info "importing #{path.inspect}"
      insert JSON.parse(File.read(path))
    end
  end

  def list
    @db[:issues]
  end

  def delete(slug)
    @db[:issues].where(:slug => slug).delete
  end

  def insert(issue)
    @db[:issues].insert(:slug => issue['slug'], :data => Sequel.pg_json(issue))
  end

  def update(issue)
    @db[:issues].where('slug = ?', issue['slug']).update(:slug => issue['slug'], :data => Sequel.pg_json(issue))
  end

  def get(slug)
    @db[:issues].where(:slug => slug).first
  end
end