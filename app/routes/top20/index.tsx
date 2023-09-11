import { useLoaderData, Link, Form } from '@remix-run/react';
import stylesUrl from '~/style/article.css';
import { PrismaClient } from '@prisma/client';

export const links = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};


export async function loader() {

  const prisma = new PrismaClient()
  const posts = await prisma.promotions.findMany({
    where: {
        promotion_title: { contains: '春'},
        week_number: { gte: '10' }
    },
    select: {
        promotion_title: true,
        promotion_id: true,
        promotion_theme_link: {
            select: {
              themes: true,
            }
        }
    }
});

  console.log(posts);

  return posts;
}

export async function action({ request }) {
  const formData = await request.formData();
  const promotion_code = formData.get('code');
  const promotion_title = formData.get('title');
  const start_date = new Date(formData.get('saleStart'));
  const start_time = formData.get('saleStartTime');

  console.log(start_time);
  
  const prisma = new PrismaClient()

  return  prisma.promotions.create({ data: {
    year: '2023',
    week_number: '12',
    promotion_code,
    promotion_title,
    sale_start_date: start_date,
    sale_start_time: new Date('2023-01-01 ' + start_time),
//    sale_start_time: new Date().getTime().toString(),
    sale_end_date: start_date,
    sale_end_time: new Date(),
    last_closing_date: start_date,
    create_user: 1,
    create_date: new Date(),
    update_user: 1,
    update_date:  new Date(),
  }});
}

export default function Top20IndexRoute() {
  // プロモーションデータ
  const posts:Array<any> = useLoaderData();

  return (
    <>
      <h2>プロモーション一覧</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.promotion_id}>
            <Link to={`/top20/${post.promotion_id}`}>{post.promotion_title}</Link>
        </li>
        ))}
      </ul>

      <div>
        <Form method="post">
          <div>
            <label htmlFor="code">プロモーションコード:</label>
            <input type="test" name="code" id="code" />
          </div>
          <div>
            <label htmlFor="title">タイトル:</label>
            <input type="text" name="title" id="title" />
          </div>
          <div>
            <label htmlFor="saleStart">販売開始日:</label>
            <input type="date" name="saleStart" id="saleStart" />
          </div>
          <div>
            <label htmlFor="saleStart">販売開始時間:</label>
            <input type="time" name="saleStartTime" id="saleStartTime" />
          </div>
          <button type="submit">作成</button>
        </Form>
      </div>      
    </>
  );
}