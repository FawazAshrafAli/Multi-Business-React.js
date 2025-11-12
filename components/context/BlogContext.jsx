import { createContext } from "react"

const BlogContext = createContext({
  blogs: [],
  setBlogs: () => {},
  resetBlogs: () => {},
})

export default BlogContext