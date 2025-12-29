# frozen_string_literal: true

# Puma configuration file for Heroku deployment
# https://devcenter.heroku.com/articles/deploying-rails-applications-with-the-puma-web-server

# Puma can serve each request in a thread from an internal thread pool.
# The `threads` method setting takes two numbers: a minimum and maximum.
max_threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
threads min_threads_count, max_threads_count

# Specifies that the worker count should equal the number of processors in production.
if ENV["RAILS_ENV"] == "production"
  require "concurrent-ruby"
  worker_count = Integer(ENV.fetch("WEB_CONCURRENCY") { Concurrent.physical_processor_count })
  workers worker_count if worker_count > 1
end

# Specifies the `port` that Puma will listen on to receive requests
port ENV.fetch("PORT") { 3000 }

# Specifies the `environment` that Puma will run in.
environment ENV.fetch("RAILS_ENV") { "development" }

# Specifies the `pidfile` that Puma will use.
pidfile ENV.fetch("PIDFILE") { "tmp/pids/server.pid" }

# Allow puma to be restarted by `rails restart` command.
plugin :tmp_restart

# Preload the application before starting workers
preload_app!

# On worker boot, establish new database connection
on_worker_boot do
  ActiveRecord::Base.establish_connection if defined?(ActiveRecord)
end
