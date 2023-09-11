/** Hacker Newsの人気・最新の記事500件の記事IDを取得する */
export async function getTopStories(): Promise<any> {
  return fetch('https://hacker-news.firebaseio.com/v0/topstories.json').then(
    (res) => {
//      console.log(res);
      return res.json();
    }
  );
}
/** 記事の詳細データを取得する */
export async function getItem(id:number): Promise<any> {
  return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
    (res) => res.json()
  );
}
