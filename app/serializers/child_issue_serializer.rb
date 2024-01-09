class ChildIssueSerializer
  include JSONAPI::Serializer
  attributes :title, :description
end
