import { delay, deepClone } from '../_helpers'
import type { Article } from './types'
import { mockArticles } from './mockData'

export async function getAdminArticles(status?: string, search?: string): Promise<Article[]> {
  await delay(300)
  let filtered = deepClone(mockArticles)

  if (status && status !== 'ALL') {
    filtered = filtered.filter((art) => art.status === status)
  }

  if (search && search.trim() !== '') {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (art) =>
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q)
    )
  }

  return filtered
}

export async function createArticle(payload: any): Promise<Article> {
  await delay(400)
  const newArticle: Article = {
    id: `art-${Date.now()}`,
    title: payload.title,
    slug: payload.title.toLowerCase().replace(/ /g, '-'),
    summary: payload.summary,
    content: payload.content,
    coverImage: payload.coverImage,
    category: payload.category || 'VEHICLE',
    status: payload.status || 'PUBLISHED',
    author: payload.author || 'Admin AutoWash',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockArticles.push(newArticle)
  return deepClone(newArticle)
}

export async function updateArticle(id: string, payload: any): Promise<Article> {
  await delay(300)
  const article = mockArticles.find((art) => art.id === id)
  if (!article) {
    throw new Error('Không tìm thấy bài viết')
  }
  article.title = payload.title
  article.summary = payload.summary
  article.content = payload.content
  article.coverImage = payload.coverImage
  article.category = payload.category
  article.status = payload.status
  article.author = payload.author
  article.updatedAt = new Date().toISOString()
  return deepClone(article)
}

export async function deleteArticle(id: string): Promise<void> {
  await delay(300)
  const index = mockArticles.findIndex((art) => art.id === id)
  if (index === -1) {
    throw new Error('Không tìm thấy bài viết')
  }
  mockArticles.splice(index, 1)
}

export async function toggleArticleStatus(id: string): Promise<Article> {
  await delay(300)
  const article = mockArticles.find((art) => art.id === id)
  if (!article) {
    throw new Error('Không tìm thấy bài viết')
  }
  article.status = article.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
  return deepClone(article)
}

// --- CLIENT ARTICLES ---
export async function getClientArticles(): Promise<Article[]> {
  await delay(300)
  return deepClone(mockArticles.filter((a) => a.status === 'PUBLISHED'))
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  await delay(200)
  const article = mockArticles.find((a) => a.slug === slug)
  if (!article) {
    throw new Error('Không tìm thấy bài viết')
  }
  return deepClone(article)
}

export async function getArticleById(id: string): Promise<Article> {
  await delay(200)
  const article = mockArticles.find((a) => a.id === id)
  if (!article) {
    throw new Error('Không tìm thấy bài viết')
  }
  return deepClone(article)
}
