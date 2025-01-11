import { Header } from '@/components';
import { EventsCard } from '@/components/eventsCard';
import { useEffect } from 'react';
import { GearApi } from '@gear-js/api';
import { Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';
import { Keyring } from '@polkadot/api';
import { WsProvider } from '@polkadot/api';
import { idl } from '@/app/utils';
import {useState} from 'react';
import { set } from 'react-hook-form';

const Explore = () => {
  const [transaction, setTransaction] = useState<any>(null);
  useEffect(() => {
    const initialize = async () => {
      const parser = await SailsIdlParser.new();
      const sails = new Sails(parser);

      async function State() {
        console.log('hello');
        try {
          sails.parseIdl(idl);
          const gearApi = await GearApi.create({
            providerAddress: 'wss://testnet.vara.network',
          });
          sails.setApi(gearApi);
          sails.setProgramId(import.meta.env.VITE_APP_PROGRAM_ID);
          console.log('Program ID:', import.meta.env.VITE_APP_PROGRAM_ID);
          const alice = 'kGkLEU3e3XXkJp2WK4eNpVmSab5xUNL9QtmLPh8QfCL2EgotW';
          const transaction:unknown = await sails.services.Common.queries.DisplayEvents(
            alice
          );
          setTransaction(transaction);

          console.log('Transaction:', transaction);
        } catch (e) {
          console.log('error:', e);
        }
      }

      State();
    };

    initialize();
  }, []);

  return (
    <>
      <Header />
      <div className='bg-[#0D1B2A] w-full min-h-screen flex flex-col items-center'>
        <div className='top text-center my-8'>
          <h1 className='text-4xl text-purple-700 font-bold mb-4'>
            All Events
          </h1>
          <div className='flex items-center border-2 border-purple-500 rounded-lg px-4 py-2 w-80 bg-[#13131a]'>
            <span className='text-purple-500 mr-2'>🔍</span>
            <input
              type='text'
              placeholder='Search by name, venue'
              className='bg-transparent outline-none text-white placeholder:text-purple-500 placeholder:opacity-80 flex-1'
            />
          </div>
        </div>
        <div className='events grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4'>
          {transaction?.map((event: any) => (
            <EventsCard event={event} key={event.id} />
          ))}
        </div>
      </div>
    </>
  );
};
export { Explore };
