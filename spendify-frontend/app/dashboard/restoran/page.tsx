import Restoran from '@/components/restoran';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ресторан',
};

export default function Customers() {
    return <Restoran />
}