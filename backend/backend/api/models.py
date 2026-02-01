from django.db import models

# Create your models here.
class Dataset(models.Model):  #Created Database called Dataset    
    
    #Store Csv file name
    name= models.CharField(max_length=255)

    #Automatically store upload time
    uploaded_at=models.DateTimeField(auto_now_add=True)

    #values -> Fast display in UI
    total_equipment=models.IntegerField()
    avg_flowrate=models.FloatField()
    avg_pressure=models.FloatField()
    avg_temperature=models.FloatField()

    '''Stores data in JSON format
                {
            "Pump": 20,
            "Valve": 15,
            "Exchanger": 10
                }
            '''
    type_distribution=models.JSONField()

    def __str__(self):
        return self.name
    