class ItemSerializer
  include JSONAPI::Serializer
  attributes :title, :list_id, :description, :image, :image_url

  def image_url
    Rails.application.routes.url_helpers.url_for(image) if image.attached?
  end

  # def image
  #   return unless @item.image.attached?

  #   Rails.application.routes.url_helpers.rails_blob_path(@item.image, only_path: true)
  # end

  # def image
  #   return unless @item.image.attached?

  #   url_for(item.image)
  # end
end
