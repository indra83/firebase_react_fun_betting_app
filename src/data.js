import teams from './teams.json'
import kp from './images/kp.png'
import hits from './images/hits.png'
import hnb from './images/hnb.png'
import gnb from './images/gnb.png'
import bcb from './images/bcb.png'

export default function getTeams() {
    teams["kp"]["logo"] = kp;
    teams["hits"]["logo"] = hits;
    teams["hnb"]["logo"] = hnb;
    teams["gnb"]["logo"] = gnb;
    teams["bcb"]["logo"] = bcb;

    return teams;
};