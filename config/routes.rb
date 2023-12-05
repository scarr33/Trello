Rails.application.routes.draw do
  devise_for :users
  get 'login/index'
  # get 'home/index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  # root "home#index"
  root to: "home#index"
  get "/register", to:"register#index"
  get "/login", to:"login#index"
  get "/dashboard", to:"dashboard#index"

  resources :boards, only: [:new, :edit, :create, :update, :destroy, :show]

  namespace :api do
    resources :boards do
      resources :lists, only: :index, controller: "lists"
    end
  end
end
