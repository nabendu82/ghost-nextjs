import styles from '../styles/Home.module.scss'
import Link from 'next/link'

const { BLOG_URL, CONTENT_API_KEY } = process.env

type Post = {
	title: string
	slug: string
  custom_excerpt: string
  feature_image: string
}

async function getPosts() {
	const res = await fetch(
		`${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}&fields=title,slug,custom_excerpt,feature_image`
	).then((res) => res.json())

	const posts = res.posts
	return posts
}

export const getStaticProps = async () => {
	const posts = await getPosts()
	return {
		revalidate: 10,
		props: { posts }
	}
}

const Home: React.FC<{ posts: Post[] }> = (props) => {
  const { posts } = props
  console.log(posts)

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>My Blog</h1>
      <div className={styles.main}>
        {posts.map((post, index) => (
          <div key={index} className={styles.post}>
            <Link href="/post/[slug]" as={`/post/${post.slug}`}>
              <a>
                <h1>{post.title}</h1>
                <p>{post.custom_excerpt}</p>
                {!!post.feature_image && <img src={post.feature_image} />}
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home

