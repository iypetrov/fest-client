import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface EventCardProps {
  id: string;
  name: string;
  thumbnailUrl: string;
}

export function EventCard({ id, name, thumbnailUrl }: EventCardProps) {
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <Link to={`/events/${id}`} style={{ textDecoration: 'none' }}>
        <CardMedia
          component="img"
          height="140"
          image={thumbnailUrl}
          alt={name}
          sx={{ cursor: 'pointer' }}
        />
      </Link>
      <CardContent>
        <Typography variant="h6">{name}</Typography>
      </CardContent>
    </Card>
  );
}

