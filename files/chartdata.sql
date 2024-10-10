-- SELECT  signal_value, FROM_UNIXTIME(signal_value) AS signal_datetime
-- FROM signal_slave where address_ip=40000;
-- insert into chartdata(datetime,value)
SELECT 
    t1.datetime,
    t2.value*1000
FROM 
    (SELECT FROM_UNIXTIME(signal_value) AS datetime
    FROM signal_slave
    WHERE address_ip = 40000) t1
JOIN 
    (SELECT signal_value AS value
    FROM signal_slave
    WHERE address_ip = 40560) t2 ON 1=1;

