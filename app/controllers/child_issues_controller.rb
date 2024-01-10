class ChildIssuesController < ApplicationController
  before_action :authenticate_user!

  # protect_from_forgery with: :null_session, only: :destroy

  def new
    @child_issue = item.child_issues.new
  end

  def create
    @child_issue = item.child_issues.new(child_issue_params)

    if @child_issue.save
      redirect_to board_path(item.list.board)
    else
      render :new
    end
  end

  def edit
    @child_issue = item.child_issues.find(params[:id])
  end

  def update
    @child_issue = item.child_issues.find(params[:id])

    if @child_issue.update(child_issue_params)
      redirect_to board_path(item.list.board)
    else
      render :edit
    end
  end

  def index
    @child_issue = item.child_issues
  end

  private

  def item
    @item ||= Item.find(params[:item_id])
  end

  def child_issue_params
    params.require(:child_issue).permit(:title, :description)
  end
end
