class Item < ApplicationRecord
  belongs_to :list

  validates :title, presence: true

  has_many :item_members, dependent: :destroy

  has_many :members, through: :item_members, source: :user

  has_one_attached :image

  def image_url
    Rails.application.routes.url_helpers.rails_blob_path(image) if image.attached?
  end

  # has_one_attached :image do |attachable|
  #   attachable.service = :cloudinary
  # end
end
