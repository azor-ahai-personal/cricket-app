module Api
  module V1
    class BootstrapsController < ApplicationController
      before_action :require_login

      def additional_bootstrapped
        render json: {
          currentUser: {
            id: @current_user.id,
            email: @current_user.email,
            name: @current_user.name
          }
        }
      end
    end
  end
end 