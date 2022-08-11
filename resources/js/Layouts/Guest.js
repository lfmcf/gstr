import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/inertia-react';

export default function Guest({ children }) {
    return (
        <div style={{height:'100vh',position:'relative'}}>
            <div>
                <Link href="/">
                    {/* <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" /> */}
                    
                </Link>
            </div>

            <div style={{border:'1px solid black',padding:'40px 100px', margin:'0',position:'absolute',top:'40%',left:'50%',transform:'translate(-50%, -50%)',width:'30%'}}>
                
                {children}
            </div>
        </div>
    );
}
