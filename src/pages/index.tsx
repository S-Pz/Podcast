import { GetStaticProps } from 'next';
import Image from 'next/image';

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import Link from 'next/link';

import styles from './home.module.scss';

//SPA
//SSR - Server-side rendeinig 
//SSG static 
//import { useEffect } from "react" para usar o spa

type Episode = {
  id: string;
  title: string;
  members:string;
  publishedAt: string;
  thumbnail: string;
  duration: number;
  durationAsString: string;
  url: string;
  //Pode haver mais elementos dentro desse objeto
}
type HomeProps = { // Objeto de episódios
  latesEpisodes: Episode[]; // Array de episódios
  allEpisodes: Episode[];
}
export default function Home({latesEpisodes, allEpisodes} :HomeProps) {
// Função que server para alterar algo sempre que uma mudança ocorre.
//Passa como parâmetros algumas variávies, já que um dos
// parâmetros é uma variável

// Requisição no modelo SPA chama 1 e depois mostra
/*useEffect(()=> { // converte a resposta em uma resposta em resposta.json
  fetch('http://localhost:3333/episodes')
  .then(response => response.json())
  .then(date => console.log(date))
}, [])*/
// Para mostrar as listagem através dos console
//console.log(props.episodes)

  return (
    <div className={styles.homepage}>
      <section className={styles.latesEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latesEpisodes.map(episode =>{
            return(
              <li key={episode.id}>
               <Image 
                  width={192}
                  height={192}
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit="cover"
               />
               <div className={styles.episodesDetails}>
                 <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                 </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
               </div>

               <button type="button">
                 <img src="/play-green.svg" alt="Tocar episódio"/>
               </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>  
          <h2>Todos episódios</h2>

          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
              <tbody>
                {allEpisodes.map(episode => {
                  return (
                    <tr key={episode.id}>
                        <td style={{width: 72}}>
                            <Image
                              width={120}
                              height={120}
                              src={episode.thumbnail} 
                              alt={episode.title}
                              objectFit="cover"
                            
                            />
                        </td>
                        <td>
                          <Link href={`/episodes/${episode.id}`}>
                            <a>{episode.title}</a>
                          </Link>
                        </td>
                        <td>{episode.members}</td>
                        <td style={{width: 100}}>{episode.publishedAt}</td>
                        <td>{episode.durationAsString}</td>
                        <td>
                          <button>
                            <img src="/play-green.svg" alt="Tocar episódio"/>
                          </button>
                        </td>
                    </tr>
                  )
                })}
              </tbody>

          </table>
      </section>
    </div>
    
  )
}
//Utilizando o SSG Executa TODA vez que todo que usuário acessa a home do site
/*export async function getServerSideProps(){
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return{
    props: {
      episodes: data,
    }
  }
}*/
//ssg Só funciona em produção executa yarn build
export const getStaticProps: GetStaticProps = async () => {
  const response = await api.get('episodes',{
    params: {
      _limit: 9,
      _sort: 'published_at',
      _order: 'desc'
    }
  })
const data = response.data
 
const episodes = data.map(episode => {
  return {
    id: episode.id,
    title: episode.title,
    thumbnail: episode.thumbnail,
    members: episode.members,
    publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale :ptBR}),
    durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
    url: episode.file.url,
  
  };
})
const latesEpisodes = episodes.slice(0, 2);
const allEpisodes = episodes.slice(2, episodes.length);

  return{
    props: {
      latesEpisodes,
      allEpisodes,

    },
    // método para se colocar um tempo para se gerar uma nova versão da página
    revalidate: 60 * 60 *8, // A cada 8h vai ser gerada uma nova verão da página home
  }
}