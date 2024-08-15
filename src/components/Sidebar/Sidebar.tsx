import './Sidebar.scss'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Item from '../Item/Item'
type Props = {}

const data = [
  'По проекту',
  'Объекты',
  'РД',
  'МТО',
  'СМР',
  'График',
  'МиМ',
  'Рабочие',
  'Капвложения',
  'Бюджет',
  'Финансирование',
  'Панорамы',
  'Камеры',
  'Поручения',
  'Контрагенты',
]

export default function Sidebar({}: Props) {
  return (
    <div className="sidebar">
      <div className="container">
        <div className="header">
          <h4 className="title">Название проекта</h4>
          <h4 className="abbreviation">Аббревиатура</h4>
        </div>

        <div className="button">
          <KeyboardArrowDownIcon className="icon" />
        </div>
      </div>
      <ul className="list"></ul>
      {data.map((item) => {
        return <Item key={item} text={item}></Item>
      })}
    </div>
  )
}
