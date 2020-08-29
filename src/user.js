import React from 'react';

import pellam from './images/users/pellam.jpg'
import boy from './images/users/boy.jpg'
import faltoo from './images/users/faltoo.jpg'
import kc from './images/users/kc.jpg'
import bhim from './images/users/bhim.jpg'
import baka from './images/users/baka.jpg'
import kuke from './images/users/kuke.jpg'
import indra from './images/users/indra.jpg'
import sandi from './images/users/sandi.jpg'
import chippa from './images/users/chippa.jpg'
import sr from './images/users/sr.jpg'
import nara from './images/users/nara.jpg'
import srihari from './images/users/srihari.jpg'
import teza from './images/users/teza.jpg'
import chicha from './images/users/chicha.jpg'

const userpics = {
    ZDUHy69hp7TOXBiQHGUp2dCedv32:{'nick':'indra', 'dp':indra},
    AsWAHPnnLBZg1DsXfgQ2Ye1BhcF2:{'nick':'baka', 'dp':baka},
    CMhnQboiWgeTg5UJtV72rwjSMp33:{'nick':'makdi', 'dp':baka},
    HNMyFBs8mUhneA1lj3QBOcWFr5J2:{'nick':'faltoo', 'dp':faltoo},
    JzGkQREOu9YyX93F9TUnWN7TvHT2:{'nick':'teza', 'dp':teza},
    hcBL3yk4RmM9as1ZaUsDCEf7Gb12:{'nick':'chippa', 'dp':chippa},

    '0wv8GxpipwdL0OziXNjM0cTsKUu1':{'nick':'kc', 'dp':kc},
    I3prJXYMmWgAa8yxX8LXyzo2B483:{'nick':'chicha', 'dp':chicha},
    NCFOSn1seFM755K9TX5N4ddCzHO2:{'nick':'sr', 'dp':sr},
    SCwVGP6qoFWCmziAfLvFBItZUdi1:{'nick':'kuke', 'dp':kuke},
    mI9212JSlHdPXscvxed1cWM2gtB3:{'nick':'sandi', 'dp':sandi}
    // hcBL3yk4RmM9as1ZaUsDCEf7Gb12:{'nick':'chippa', 'dp':chippa},
}

export default function getUserDP(uid){
    if(uid in userpics) {
        return userpics[uid];
    }
    return {'nick':'', 'dp':''};
}