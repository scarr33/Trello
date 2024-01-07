class ItemSerializer
  include JSONAPI::Serializer
  attributes :title, :list_id, :description, :image_url

  attribute :members do |object|
    UserSerializer.new(object.members).serializable_hash
  end
end
