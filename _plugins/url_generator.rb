require 'json'

module Jekyll
  class UrlGenerator < Generator
    safe true
    priority :high

    def generate(site)
      # Read URL data
      urls_file = File.join(site.source, 'data', 'urls.json')
      return unless File.exist?(urls_file)

      begin
        urls_data = JSON.parse(File.read(urls_file))
      rescue JSON::ParserError => e
        Jekyll.logger.error "URL Generator:", "Error parsing urls.json: #{e.message}"
        return
      end

      urls_data.each do |short_code, data|
        # Create a redirect page for each short URL
        site.pages << RedirectPage.new(site, short_code, data)
      end

      # Make URLs data available to the site
      site.data['urls'] = urls_data
    end
  end

  class RedirectPage < Page
    def initialize(site, short_code, url_data)
      @site = site
      @base = site.source
      @dir = short_code
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(@base, '_layouts'), 'redirect.html')

      self.data['title'] = "Redirecionando para #{url_data['originalUrl']}"
      self.data['redirect_to'] = url_data['originalUrl']
      self.data['short_code'] = short_code
      self.data['created_at'] = url_data['createdAt']
      self.data['clicks'] = url_data['clicks'] || 0
      self.data['created_by'] = url_data['createdBy'] || 'unknown'
    end
  end
end