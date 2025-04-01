Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"

  namespace :api do
    namespace :v1 do
      post '/signup', to: 'authentication#signup'
      post '/login', to: 'authentication#login'
      resources :players, only: [:index]
      resources :contests, only: [:index, :create, :update, :destroy, :show] do
        put 'join', on: :collection
        put 'participate', on: :member
      end
      resources :fantasy_teams, only: [:index, :create, :update, :destroy, :show] do
        put 'publish', on: :member
      end
      resource :bootstraps, only: [:show] do
        get 'additional_bootstrapped', on: :collection
      end
    end
  end

  # Serve React app for all other routes
  get '*path', to: 'application#frontend', constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
  
  root 'application#frontend'
end
