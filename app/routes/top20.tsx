import { useLoaderData, Link, Outlet } from "@remix-run/react";
import { getItem, getTopStories } from '~/utils/hackerNews.server';
import stylesUrl from '~/style/top20.css';
import { Key, ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react";
// (5) このページで読み込むCSSファイルを指定する
export const links = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};
// (1) サーバーサイドでデータを取得する
export const loader = async () => {
  // 500件のデータを取得する
  const top500Ids = await getTopStories();
  // 上位20件のIDだけに絞り込む
  const top20Ids = top500Ids.slice(0, 20);
  // 上位20件の記事データを取得する
  const top20 = await Promise.all(top20Ids.map((id:number) => getItem(id)));
  // 記事データのIDとタイトルだけに絞り込む
  const top20Summary = top20.map((item) => ({
    id: item.id,
    title: item.title,
  }));
  // idとtitleのみのオブジェクトが20件入った配列を返す
  return top20Summary;
};
// /top20 のURLで表示するページのコンポーネント
export default function Top20Route() {
  // (2) loaderで取得済みのデータを取り出す
  const data = useLoaderData();
  // let item = {id:Number, title:String };
  return (
    <div>
      <header>
        <h1>Hacker News Viewer</h1>
      </header>
      <div id="container">
        <div id="sidebar">
          <h2>Top 20</h2>
          <nav>
            <ul>
              {data.map((item: { id: string; title: string; }) => (
                <li key={item.id}>
                  {/* (3) タイトルをリンクにする */}
                  <Link to={`/top20/${item.id}`}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

