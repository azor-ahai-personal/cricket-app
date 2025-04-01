module ApplicationHelper
    def current_user
        decoded = decoded_token
        return nil if decoded.nil? # Return nil if the token is invalid

        user_id = decoded['user_id'].to_s
        @current_user ||= User.find_by(id: user_id)
    end

    def require_login
        # return if %w[signup login].include?(params[:action]) 

        unless signed_in?
            render json: { error: 'Unauthorized' }, status: :unauthorized
            return # Ensure to exit after rendering
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
        token = access_token
        return nil if token.nil? # Return nil if there's no token

        begin
            JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
        rescue JWT::DecodeError
            nil # Return nil if decoding fails
        end
    end
end
