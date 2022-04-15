import format from 'date-fns/format';//Biblioteca para a importação de data
import ptBR from 'date-fns/locale/pt-BR';//Biblioteca para a importação de data utilizando o yarn add date-fns

import styles from './styles.module.scss';

export function Header(){
    const currentDate = format(new Date(), 'EEEEEE, d MMMM',{
        locale: ptBR,
    });
    return(     // depois do ponto é o nome da classe utilizada para a estilização no module.scss
        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="podcast"/>

            <p>O melhor para você ouvir, Sempre</p>
            <span>{currentDate}</span>
        </header>

    );
}