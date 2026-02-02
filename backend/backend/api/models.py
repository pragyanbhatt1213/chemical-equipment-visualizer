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
    
    # New analytics fields
    statistics = models.JSONField(default=dict)  # min, max, median, std for each parameter
    equipment_data = models.JSONField(default=list)  # detailed equipment with health scores
    avg_health_score = models.FloatField(default=100)  # average health score across all equipment
    outliers = models.JSONField(default=list)  # list of outlier equipment
    outlier_count = models.IntegerField(default=0)  # count of outliers
    efficiency_ranking = models.JSONField(default=list)  # ranked equipment by efficiency
    risk_summary = models.JSONField(default=dict)  # high/medium/low risk counts

    def __str__(self):
        return self.name
    