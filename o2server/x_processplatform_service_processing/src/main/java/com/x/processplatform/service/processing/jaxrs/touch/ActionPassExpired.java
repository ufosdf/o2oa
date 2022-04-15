package com.x.processplatform.service.processing.jaxrs.touch;

import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.container.factory.EntityManagerContainerFactory;
import com.x.base.core.project.http.ActionResult;
import com.x.base.core.project.http.EffectivePerson;
import com.x.base.core.project.jaxrs.WrapBoolean;
import com.x.base.core.project.logger.Logger;
import com.x.base.core.project.logger.LoggerFactory;
import com.x.processplatform.service.processing.ThisApplication;
import com.x.processplatform.service.processing.schedule.PassExpired;

class ActionPassExpired extends BaseAction {

	private static final Logger LOGGER = LoggerFactory.getLogger(ActionPassExpired.class);

	ActionResult<Wo> execute(EffectivePerson effectivePerson) throws Exception {

		LOGGER.debug("execute:{}.", effectivePerson::getDistinguishedName);
		
		try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
			ActionResult<Wo> result = new ActionResult<>();
			ThisApplication.context().scheduleLocal(PassExpired.class, 1);
			Wo wo = new Wo();
			wo.setValue(true);
			result.setData(wo);
			return result;
		}
	}

	public static class Wo extends WrapBoolean {

		private static final long serialVersionUID = 3884378140488608659L;

	}

}