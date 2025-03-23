module ApplicationHelper
    def current_user
        user_id = decoded_token['user_id'].to_s
        @current_user ||= User.find_by(id: user_id)
    end

    def require_login
        unless signed_in?
            render json: { error: 'Unauthorized' }, status: :unauthorized
        end
    end

    def signed_in?
        user = current_user
        if user.nil? || user.id.to_s != decoded_token['user_id'].to_s
            return false
        end
        true
    end

    def access_token
        @access_token ||= request.headers['Authorization']&.split(' ')&.last
    end

    def decoded_token
        JWT.decode(access_token, Rails.application.credentials.secret_key_base)[0]
    end
end
