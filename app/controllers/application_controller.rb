class ApplicationController < ActionController::Base
  include ApplicationHelper
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :set_current_user
  before_action :require_login
  protect_from_forgery with: :null_session

  def frontend
    render file: 'public/index.html'
  end

  private

  def set_current_user
    @current_user = current_user
  end
end
