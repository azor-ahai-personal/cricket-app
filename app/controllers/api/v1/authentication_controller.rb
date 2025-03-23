module Api
  module V1
    class AuthenticationController < ApplicationController

      skip_before_action :require_login
      skip_before_action :set_current_user

      def signup
        @user = User.new(user_params)
        
        if @user.save
          token = jwt_encode(user_id: @user.id)
          render json: { token: token, email: @user.email }, status: :created
        else
          render json: { errors: @user.errors.full_messages }, 
                 status: :unprocessable_entity
        end
      end

      def login
        @user = User.find_by(email: params[:email])
        
        if @user&.authenticate(params[:password])
          token = jwt_encode(user_id: @user.id)
          render json: { token: token, email: @user.email }, status: :ok
        else
          render json: { error: 'unauthorized' }, status: :unauthorized
        end
      rescue => e
        render json: { error: 'internal_server_error' }, status: :internal_server_error
      end

      private

      def user_params
        params.permit(:email, :password)
      end

      def jwt_encode(payload, exp = 24.hours.from_now)
        payload[:exp] = exp.to_i
        JWT.encode(payload, Rails.application.credentials.secret_key_base)
      end
    end
  end
end 