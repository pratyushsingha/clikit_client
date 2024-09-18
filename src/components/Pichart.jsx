import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/Index';

import { PieChart, Pie } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const Pichart = ({ chartTitle, config, data, dataKey, nameKey }) => {
  const { user } = useAuthStore();
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{chartTitle}</CardTitle>
        <CardDescription>2024-'25</CardDescription>
      </CardHeader>
      <CardContent className={`relative flex-1 pb-0`}>
        <div className={` ${user.userType === 'free' ? 'blur-lg' : ''}`}>
          <ChartContainer
            config={config}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={data} dataKey={dataKey} nameKey={nameKey} />
            </PieChart>
          </ChartContainer>
        </div>
        {user.userType === 'free' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Link to={'/pricing'}>
              <Button
                variant="bg-transparent"
                className="hover:border hover:border-green-500"
              >
                Upgrade to View
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Pichart;
