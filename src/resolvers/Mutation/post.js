const { getUserId } = require('../../utils')

const post = {
  async createDraft(parent, { title, caption }, context) {
    const userId = getUserId(context)
    return context.prisma.createPost({
      title,
      author: { connect: { id: userId } },
      caption,
    })
  },

  async publish(parent, { id }, context) {
    const userId = getUserId(context)
    const postExists = await context.prisma.$exists.post({
      id,
      author: { id: userId },
    })
    if (!postExists) {
      throw new Error(`Post not found or you're not the author`)
    }

    return context.prisma.updatePost(
      {
        where: { id },
        data: { published: true },
      },
    )
  },

  async deletePost(parent, { id }, context) {
    const userId = getUserId(context)
    const postExists = await context.prisma.$exists.post({
      id,
      author: { id: userId },
    })
    if (!postExists) {
      throw new Error(`Post not found or you're not the author`)
    }

    return context.prisma.deletePost({ id })
  },
}

module.exports = { post }
