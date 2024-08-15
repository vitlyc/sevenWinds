import './Item.scss'
import DashboardIcon from '@mui/icons-material/Dashboard'

type Props = {
  text: string
}

export default function Item({ text }: Props) {
  return (
    <div className="item">
      <DashboardIcon style={{ marginRight: '14px' }} />
      <div className="name">{text}</div>
    </div>
  )
}
