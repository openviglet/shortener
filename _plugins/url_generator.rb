require 'json'

module Jekyll
  class UrlGenerator < Generator
    safe true
    priority :high

    def generate(site)
      # Read URL data
      urls_file = File.join(site.source, 'data', 'urls.json')
      
      unless File.exist?(urls_file)
        Jekyll.logger.warn "URL Generator:", "urls.json file not found at #{urls_file}"
        return
      end

      begin
        urls_data = JSON.parse(File.read(urls_file))
        Jekyll.logger.info "URL Generator:", "Successfully loaded #{urls_data.size} URLs from data/urls.json"
      rescue JSON::ParserError => e
        Jekyll.logger.error "URL Generator:", "Error parsing urls.json: #{e.message}"
        return
      end

      generated_pages = 0
      urls_data.each do |short_code, data|
        # Validate that required data exists
        unless data['originalUrl']
          Jekyll.logger.warn "URL Generator:", "Missing originalUrl for short code '#{short_code}', skipping"
          next
        end
        
        # Create a redirect page for each short URL
        redirect_page = RedirectPage.new(site, short_code, data)
        site.pages << redirect_page
        generated_pages += 1
        Jekyll.logger.debug "URL Generator:", "Generated page for '#{short_code}' -> '#{data['originalUrl']}'"
      end

      Jekyll.logger.info "URL Generator:", "Generated #{generated_pages} redirect pages"

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
      
      # Check if the redirect layout exists
      layout_file = File.join(@base, '_layouts', 'redirect.html')
      unless File.exist?(layout_file)
        Jekyll.logger.error "URL Generator:", "Redirect layout not found at #{layout_file}"
        raise "Redirect layout not found"
      end
      
      self.read_yaml(File.join(@base, '_layouts'), 'redirect.html')

      # Set page data with defaults
      original_url = url_data['originalUrl'] || ''
      self.data['title'] = "Redirecionando para #{original_url}"
      self.data['redirect_to'] = original_url
      self.data['short_code'] = short_code
      self.data['created_at'] = url_data['createdAt'] || Time.now.iso8601
      self.data['clicks'] = url_data['clicks'] || 0
      self.data['created_by'] = url_data['createdBy'] || 'unknown'
      
      Jekyll.logger.debug "URL Generator:", "Created redirect page for #{short_code} at #{@dir}/#{@name}"
    end
  end
end