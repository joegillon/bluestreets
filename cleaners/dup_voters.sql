select last_name, first_name, middle_name, birth_year
from voters
group by last_name,first_name,middle_name,birth_year
having count(last_name || ':' || first_name || ':' || middle_name || ':' || birth_year) > 1;