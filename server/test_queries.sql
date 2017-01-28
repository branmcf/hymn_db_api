
SELECT e.name
FROM Ethnicities e
INNER JOIN user_ethnicities ue ON ue.ethnicity_id = e.id
INNER JOIN users u on ue.user_id = u.id
WHERE u.id = 1
